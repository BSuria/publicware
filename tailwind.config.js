const withMT = require("@material-tailwind/html/utils/withMT");

module.exports = withMT({
    content: ["./index.ejs"],
    theme: {
        extend: {},
    },
    plugins: [],
});