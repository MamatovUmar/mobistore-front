# Адаптация админ-панели под мобильные устройства

**Дата:** 2026-05-14
**Ветка:** `feat/admin`
**Скоуп:** `/admin/**` (layout, страницы, компоненты)

## Цель

Сделать все страницы админки `/admin` (9 страниц, ~37 компонентов, ~11k строк кода) корректно работающими на мобильных (`<768px`) и планшетных (`768–1023px`) устройствах. Десктопный вид остаётся как есть.

## Жёсткое ограничение

**Клиентская (публичная) часть сайта не должна сломаться.** Админка делит с публичной частью:
- `app/assets/styles/main.scss`, `_utils.scss`, `_colors.scss`
- `@element-plus/nuxt` (глобальная конфигурация Element Plus)
- CSS-переменные `--color-*`
- `app/layouts/default.vue` / `empty.vue` (нерелевантны админке)

В общие файлы — **только добавлять**, не модифицировать существующие правила. Все admin-стили — `scoped` или префиксованные `.admin-*`. Глобальные `:deep()` для Element Plus не использовать.

## Брейкпоинты

| Имя       | Диапазон        | Когда применяется                          |
|-----------|-----------------|--------------------------------------------|
| `mobile`  | `< 768px`       | sidebar off-canvas, fullscreen drawer/dialog, фильтры в bottom-sheet |
| `tablet`  | `768 – 1023px`  | stats 2 колонки, sidebar collapsed по умолчанию |
| `desktop` | `≥ 1024px`      | текущая верстка                            |

Унификация: в коде сейчас встречаются `600px`, `768px`, `1024px`, `1200px` — оставляем используемые в существующих стилях клиентской части без изменений, но **в admin-скоупе** используем только три значения выше.

## Архитектура решения

### 1. Новый композабл `useBreakpoints`

**Файл:** `app/composables/useBreakpoints.ts`

```ts
export function useBreakpoints() {
  const width = ref(0)

  const updateWidth = () => { width.value = window.innerWidth }

  onMounted(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })

  const isMobile = computed(() => width.value > 0 && width.value < 768)
  const isTablet = computed(() => width.value >= 768 && width.value < 1024)
  const isDesktop = computed(() => width.value >= 1024)

  return { isMobile, isTablet, isDesktop, width }
}
```

SSR-safe: `width.value === 0` до hydrate; во всех использованиях `client-only` обёртка либо проверка `width.value > 0`. Админ-layout уже обёрнут в `<client-only>`, проблема не стоит.

### 2. SCSS-миксины

**Файл:** `app/assets/styles/_utils.scss` — **только добавить в конец**, ничего не менять:

```scss
@mixin admin-mobile {
  @media (max-width: 767px) { @content; }
}
@mixin admin-tablet-down {
  @media (max-width: 1023px) { @content; }
}
@mixin admin-desktop-up {
  @media (min-width: 1024px) { @content; }
}
```

Префикс `admin-` — чтобы не конкурировать с возможными существующими/будущими миксинами публичной части.

### 3. Layout / Sidebar / Header

#### `app/layouts/admin.vue`

- Добавить состояние `mobileSidebarOpen` (отдельно от `isCollapsed`)
- Передать в `AdminSidebar`: `:mobile-open="mobileSidebarOpen"`
- Передать в `AdminHeader`: эмит `toggle-mobile-sidebar`
- Рендерить `<div class="admin-backdrop">` поверх контента, когда `mobileSidebarOpen && isMobile`
- На `mobile`: `margin-left: 0` независимо от `isCollapsed`

#### `AdminSidebar.vue`

- Добавить props `mobileOpen: boolean`
- На `mobile`:
  - `position: fixed; transform: translateX(-100%)` по умолчанию
  - `transform: translateX(0)` при `mobileOpen`
  - Ширина — фиксированные `240px` (без collapse)
- Клик по `<NuxtLink>` пункта меню — emit `close` → закрыть sidebar
- Тапнуть по backdrop — закрыть sidebar (логика в layout)

#### `AdminHeader.vue`

- На `mobile`: иконка бургера эмитит `toggle-mobile-sidebar` вместо `toggle-sidebar`
- На `desktop`: текущее поведение (Fold/Expand для collapse)
- `getPageTitle()` — дополнить недостающими маршрутами (`/admin/staff`, `/admin/applications`, `/admin/brands`, `/admin/models`)

### 4. Таблицы (горизонтальный скролл)

Element Plus `el-table` уже умеет горизонтальный скролл из коробки, если суммарная ширина колонок > контейнера. Что нужно:
- Убедиться, что у всех таблиц правая колонка «Действия» — `fixed="right"` (уже есть в большинстве)
- Встроенная тень `el-table` при `fixed`-колонке уже даёт визуальный hint о скролле — дополнительно ничего не добавляем
- На мобильных кликабельность ряда (`@row-click`) остаётся — открывает Detail Drawer

**Никакой альтернативной разметки для мобильных — горизонтальный скролл, как и условились.**

### 5. Drawer / Dialog (fullscreen на мобильных)

Применить ко всем `el-drawer` и `el-dialog` в `app/components/admin/**`:

**Drawer:**
```vue
<el-drawer :size="isMobile ? '100%' : 500">
```

**Dialog:**
```vue
<el-dialog :fullscreen="isMobile" :width="isMobile ? '100%' : 500">
```

Список затрагиваемых файлов:
- `user/DetailDrawer.vue`, `user/EditDrawer.vue`
- `listing/DetailDrawer.vue`, `listing/RejectDialog.vue`, `listing/StatusDialog.vue`
- `application/DetailDrawer.vue`
- `staff/DetailDrawer.vue`, `staff/EditDrawer.vue`, `staff/AddStaffDialog.vue`
- `logs/DetailDrawer.vue`, `logs/CleanupDialog.vue`
- `brand/CreateDialog.vue`, `brand/EditDialog.vue`

Внутри drawer/dialog проверить, что:
- Формы (`el-form`) — `label-position="top"` на мобильных (если сейчас `right`/`left`)
- Кнопки футера на мобильных стекают в столбец и тянутся на 100% ширины
- Контент с большим текстом (логи, JSON) — `word-break: break-word; overflow-wrap: anywhere`

### 6. Фильтры — bottom-sheet drawer на мобильных

Сейчас `*Filters.vue` рендерится inline в странице, раскрывается по клику на кнопку «Фильтры» (`v-if="showFilters"` или прозрачное скрытие).

**Решение:** оборачивать `*Filters.vue` в `el-drawer direction="btt" :size="90%"` на `isMobile`, с собственной кнопкой «Применить» и «Сбросить» в футере. На десктопе остаётся inline-блок.

Реализация — единый wrapper-компонент `AdminFiltersPanel.vue` (новый), который принимает контент через `<slot>` и решает, как рендерить:

```vue
<!-- AdminFiltersPanel.vue -->
<template>
  <el-drawer v-if="isMobile" :model-value="visible" direction="btt" size="90%" ...>
    <slot />
    <template #footer>...</template>
  </el-drawer>
  <div v-else-if="visible" class="admin-filters-inline">
    <slot />
  </div>
</template>
```

В страницах: оборачиваем `<AdminUserFilters>` → `<AdminFiltersPanel v-model:visible="showFilters">...</AdminFiltersPanel>`.

Затрагиваемые страницы: `users`, `listings`, `applications`, `logs`, `brands`.

### 7. Пагинация

В каждой таблице (`user/Table.vue`, `listing/Table.vue`, `application/Table.vue`, `staff/Table.vue`, `logs/Table.vue`, `brand/Table.vue`):

```vue
<el-pagination
  :layout="isMobile ? 'prev, pager, next' : 'total, sizes, prev, pager, next'"
  :pager-count="isMobile ? 5 : 7"
  :small="isMobile"
  :page-sizes="[10, 20, 50, 100]"
  ...
/>
```

Контейнер `.table-pagination` на мобильных → `justify-content: center`.

### 8. Page-header + toolbar (унификация)

Сейчас на каждой странице свой `.page-toolbar` со своими `@media`. Стандартизируем через **CSS-класс в каждой странице** (без выноса в отдельный компонент — слишком разная начинка):

Структура:
```html
<div class="admin-page-header">
  <div class="admin-page-titles">
    <h1>...</h1>
    <p>...</p>
  </div>
</div>

<div class="admin-page-toolbar">
  <div class="toolbar-left">  <!-- search + filter btn -->
  <div class="toolbar-right"> <!-- refresh + create btn -->
</div>
```

На `mobile`:
- `admin-page-header` — без изменений (вертикальный)
- `admin-page-toolbar` — `flex-direction: column`, обе группы `width: 100%`
- `search-input` — `width: 100%`

Сами стили вынести **не** в общий SCSS, а оставить scoped в каждой странице (чтобы не плодить глобальные классы). Шаблон копи-паст по 9 страницам — пусть будет дублирование, важно не задевать глобал.

### 9. Stats-карточки

- `pages/admin/index.vue` `.stats-grid` — уже адаптировано (4→2→1), унифицируем брейкпоинты на `768px` и `1024px`
- `listing/Stats.vue`, `logs/Stats.vue` — привести к тому же паттерну

### 10. Page-by-page чек-лист дополнительно

- **`admin/models.vue`** (614 строк) — самый большой; `ModelForm.vue` (225 строк) и `ModelImages.vue` (180 строк) проверить отдельно на адаптивность форм и сетки изображений
- **`admin/brands.vue`** — `CreateDialog`/`EditDialog` с загрузкой изображений: после fullscreen drag&drop зона должна растянуться
- **`admin/logs.vue`** + `logs/DetailDrawer.vue` — JSON-блоки, добавить `word-break`
- **`admin/cache.vue`** — отдельно проверить (специфическая страница без таблицы, может быть карточная)

## Поток данных

Никаких изменений в стейте/API/композаблах данных. Адаптация — чисто визуальная (CSS + 2-3 пропса в Element Plus компонентах).

## Тестирование

Ручное тестирование на брейкпоинтах:
- **Mobile**: 360px (Android small), 390px (iPhone 14), 414px (iPhone Pro Max)
- **Tablet**: 768px (iPad portrait), 1024px (iPad landscape)
- **Desktop**: 1280px, 1920px

Для каждой страницы проверить:
1. Sidebar открывается по бургеру, закрывается тапом по backdrop / пункту меню / повторным тапом бургера
2. Таблица скроллится горизонтально, колонка действий зафиксирована справа
3. Клик по ряду → Detail Drawer fullscreen
4. Кнопка «Редактировать» → Edit Drawer fullscreen
5. Кнопка «Фильтры» → bottom-sheet с фильтрами, «Применить»/«Сбросить» работают
6. Пагинация компактна, переключение страниц работает
7. Диалоги подтверждений (`ElMessageBox.confirm`) выглядят нормально (это глобальный Element Plus — он сам адаптивен; проверим без правок)

**Проверка не-регрессии публичной части:** после правок открыть несколько публичных страниц (`/`, `/search`, `/login`, `/account/*`, `/ads/[alias]`) на десктопе и мобильном — убедиться, что ничего не изменилось.

## Порядок реализации

Этапы, каждый — отдельный коммит:

1. **Фундамент** — `useBreakpoints` композабл + SCSS-миксины
2. **Shell** — `admin.vue` layout + `AdminSidebar` + `AdminHeader` (off-canvas)
3. **Tables + Pagination** — все 6 файлов Table.vue (горизонтальный скролл + адаптивная пагинация)
4. **Drawers + Dialogs** — все ~13 модальных компонентов (fullscreen на мобильных)
5. **Filters panel** — новый `AdminFiltersPanel.vue` + интеграция в 5 страниц
6. **Page toolbars + stats** — унификация во всех 9 страницах
7. **Page-specific tweaks** — models, brands (upload), logs (JSON), cache

После каждого этапа — визуальная проверка на 360px / 768px / 1280px.

## Не включено в скоуп (YAGNI)

- Перевёрстка таблиц в карточный вид (явно отказались в пользу горизонтального скролла)
- Bottom navigation bar (явно отказались в пользу off-canvas)
- Bottom-sheet для Detail Drawer (оставили fullscreen справа)
- Тёмная тема, кастомные жесты свайпом
- Адаптация публичной части сайта
- Создание `useDevice`/`useWindowSize` под публичную часть
