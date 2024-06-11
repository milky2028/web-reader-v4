export const progress = $state({ current: 0, max: 0 });

export const setMaxProgress = (max: number) => (progress.max = max);
export const incrementProgress = (by = 1) => (progress.current += by);

export const resetProgress = () => {
	progress.current = 0;
	progress.max = 0;
};
