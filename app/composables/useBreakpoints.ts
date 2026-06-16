const MOBILE_MAX = 767;
const TABLET_MAX = 1023;

export function useBreakpoints() {
  const width = ref(0);

  const update = () => {
    if (typeof window !== "undefined") {
      width.value = window.innerWidth;
    }
  };

  onMounted(() => {
    update();
    window.addEventListener("resize", update);
  });

  onUnmounted(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", update);
    }
  });

  const isMobile = computed(() => width.value > 0 && width.value <= MOBILE_MAX);
  const isTablet = computed(
    () => width.value > MOBILE_MAX && width.value <= TABLET_MAX,
  );
  const isDesktop = computed(() => width.value > TABLET_MAX);
  const isTabletOrSmaller = computed(
    () => width.value > 0 && width.value <= TABLET_MAX,
  );

  return { width, isMobile, isTablet, isDesktop, isTabletOrSmaller };
}
