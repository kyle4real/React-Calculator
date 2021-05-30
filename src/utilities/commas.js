const regex = /(\d)(?=(\d{3})+$)/g;

const commas = (str) => {
    if (!str) return;
    if (typeof str !== "string") str = str.toString();
    str = str.split(".");
    str[0] = str[0].replace(regex, "$&,");
    return str.join(".");
};

export default commas;
