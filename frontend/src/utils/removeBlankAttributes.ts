// @ts-ignore
export const removeBlankAttributes = (obj) =>
    // @ts-ignore
    Object.entries(obj).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {})
