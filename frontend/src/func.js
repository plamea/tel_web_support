const paginate = (array, n) => {
    const pageSize = Math.ceil(array.length / n);

    return Array.from({ length: pageSize }, (_, index) => {
        const start = index * n;
        return array.slice(start, start + n);
    });
};

export {paginate}