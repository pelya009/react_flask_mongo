export function isServerSide() {
    // Вы можете возмутиться, что в браузере не будет process,
    // но компиляция с полифиллами как-то разруливает этот вопрос.
    return process.env.APP_ENV !== undefined;
}
