/// Take in a value size, if true, return value if true, else default, if on server will return default
export function mobile_sizing<T> (size: Ref<boolean>, value_if_true: T, default_value: T) {
	return computed(() =>
		import.meta.client
			? (size.value ? value_if_true : default_value)
			: default_value,
	)
}
