import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";
import babel from "rollup-plugin-babel";

export default {
    input: pkg.source,
    output: [
        {
            file: pkg.main,
            format: "cjs",
            sourcemap: true
        },
        {
            file: pkg.module,
            format: "es",
            sourcemap: true
        },
        {
            file: pkg["umd:main"],
            format: "umd",
            name: pkg.name,
            sourcemap: true
        }
    ],
    plugins: [
        babel({
            plugins: [
                [
                    "@babel/plugin-proposal-object-rest-spread",
                    { loose: true, useBuiltIns: true }
                ]
            ]
        }),
        terser(),
        filesize()
    ]
};
