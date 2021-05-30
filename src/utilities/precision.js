const precision = (num) => {
    const str = num.toString();
    if (!str.includes(".")) return num;
    const arr = str.split(".");
    if (arr[1].length > 4) {
        return num.toFixed(4);
    }
    return num;
};

export default precision;
