let { h, render, useState, useEffect } = require("../dist/orby");

describe("svg", () => {
    test("svg basic", () => {
        render(
            <svg
                height="100"
                width="100"
                onCreated={target => {
                    expect(target.outerHTML).toBe(
                        `<svg height="100" width="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red"></circle></svg>`
                    );
                }}
            >
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="black"
                    stroke-width="3"
                    fill="red"
                />
            </svg>,
            document.body
        );
    });
    test("svg path", () => {
        render(
            <svg
                height="496pt"
                viewBox="0 0 496 496"
                width="496pt"
                xmlns="http://www.w3.org/2000/svg"
                onCreated={target => {
                    expect(target.outerHTML).toBe(
                        `<svg height="496pt" viewBox="0 0 496 496" width="496pt"><path d="m286.761719 99.238281c-4.929688-25.382812-25.367188-45.535156-50.839844-50.167969-4.222656-.757812-8.390625-.964843-12.527344-.925781-3.847656-27.160156-27.191406-48.144531-55.394531-48.144531-14.503906 0-27.695312 5.59375-37.652344 14.671875-7.714844-4.128906-16.25-6.464844-25.121094-6.664063-11.121093-.214843-22.359374 3.832032-31.625 11.441407-21.085937 17.320312-25.769531 32.648437-25.609374 45.109375-12.207032 1.738281-23.429688 7.425781-32.183594 16.449218-10.628906 10.960938-16.238282 25.425782-15.7812502 40.710938.9023442 29.929688 26.9101562 54.28125 57.9921872 54.28125h93.980469v152c0 13.230469 10.769531 24 24 24 13.234375 0 24-10.769531 24-24v-9.472656c2.515625.898437 5.1875 1.472656 8 1.472656 13.234375 0 24-10.769531 24-24v-120.496094c16.128906-2.007812 30.90625-10.078125 41.410156-22.816406 12.207032-14.816406 17.078125-34.296875 13.351563-53.449219zm0 0" fill="#f0bc5e"></path><path d="m272 256c0 17.648438 14.355469 32 32 32 5.472656 0 10.761719-1.433594 15.722656-4.246094l-7.914062-13.90625c-2.519532 1.425782-5.144532 2.152344-7.808594 2.152344-8.820312 0-16-7.175781-16-16 0-2.222656.554688-4.34375 1.417969-6.320312 5.679687 6.761718 13.550781 11.695312 22.679687 13.527343l3.152344-15.6875c-11.152344-2.238281-19.25-12.128906-19.25-23.519531 0-13.230469 10.769531-24 24-24 13.234375 0 24 10.769531 24 24 0 4.910156-1.511719 9.664062-4.375 13.734375l13.089844 9.203125c4.765625-6.777344 7.285156-14.714844 7.285156-22.9375 0-22.054688-17.941406-40-40-40-22.054688 0-40 17.945312-40 40 0 3.289062.539062 6.457031 1.304688 9.535156-5.878907 5.945313-9.304688 13.960938-9.304688 22.464844zm0 0"></path><path d="m435.90625 256.136719c17.839844-23.519531 32.550781-46.90625 42.992188-68.847657 20.832031-43.800781 22.617187-77.609374 5.023437-95.199218-17.601563-17.609375-51.40625-15.816406-95.207031 5.015625-22.273438 10.597656-46.023438 25.605469-69.914063 43.816406-13.75-10.523437-25.398437-19-31.175781-23.160156-.527344 5.839843-1.765625 11.550781-3.832031 16.992187 5.578125 4.070313 13.265625 9.757813 21.960937 16.367188-16.0625 13.03125-32.082031 27.429687-47.640625 42.992187-9.101562 9.09375-17.734375 18.472657-26.113281 27.917969v24.433594c11.59375-13.9375 24.128906-27.746094 37.425781-41.039063 16.136719-16.144531 32.753907-30.984375 49.359375-44.273437 18.160156 14.175781 38.105469 30.582031 51.792969 44.273437 15.886719 15.886719 31.167969 33.191407 45.023437 50.820313-13.480468 16.929687-28.566406 33.882812-45.023437 50.339844-16.550781 16.550781-33.625 31.71875-50.59375 45.207031-17.007813-13.527344-34.03125-28.671875-50.558594-45.207031-13.34375-13.355469-25.871093-27.152344-37.425781-41.042969v24.433593c8.363281 9.429688 16.984375 18.792969 26.113281 27.917969 15.929688 15.929688 32.335938 30.679688 48.785157 43.953125-40 29.785156-78.441407 49.28125-106.898438 53.328125v-87.175781c0 10.414062-6.710938 19.214844-16 22.527344v73.472656c0 30.871094-25.117188 56-56 56-30.878906 0-56-25.128906-56-56v-8h32v-16h-32v-16h48v-16h-48v-16h32v-16h-32v-16h48v-16h-48v-16h32v-16h-32v-16h48v-16h-48v-16h80v-16h-104c-4.40625 0-8-3.585938-8-8v-16c0-4.414062 3.59375-8 8-8h104v-16h-104c-13.230469 0-24 10.769531-24 24v16c0 13.230469 10.769531 24 24 24h8v200c0 39.703125 32.304688 72 72 72 37.21875 0 67.929688-28.382812 71.625-64.640625 32.570312-3.824219 75.777344-25.457031 120.417969-59.3125 23.460937 17.777344 46.773437 32.441406 68.664062 42.855469 23.839844 11.335937 44.71875 17.035156 61.640625 17.035156 14.167969 0 25.550782-3.992188 33.574219-12.015625 29.320313-29.328125 1.953125-97.457031-48.015625-163.785156zm-54.015625-62.023438c-13.519531-13.519531-32.425781-29.226562-50.058594-43.082031 21.839844-16.367188 43.457031-29.824219 63.746094-39.472656 36.671875-17.453125 64.75-20.414063 77.023437-8.160156 12.265626 12.265624 9.289063 40.335937-8.160156 77.027343-9.496094 19.957031-22.648437 41.207031-38.664062 62.6875-13.488282-16.847656-28.296875-33.417969-43.886719-49zm90.71875 214.488281c-12.261719 12.277344-40.335937 9.292969-77.023437-8.160156-19.921876-9.472656-41.121094-22.59375-62.566407-38.5625 16.375-13.207031 32.8125-27.925781 48.871094-43.992187 15.839844-15.839844 30.503906-32.152344 43.71875-48.503907 43.152344 58.425782 68.617187 117.601563 47 139.21875zm0 0"></path><path d="m56 144c13.234375 0 24-10.769531 24-24s-10.765625-24-24-24c-13.230469 0-24 10.769531-24 24s10.769531 24 24 24zm0-32c4.410156 0 8 3.585938 8 8s-3.589844 8-8 8c-4.40625 0-8-3.585938-8-8s3.59375-8 8-8zm0 0"></path><path d="m224 136c13.234375 0 24-10.769531 24-24s-10.765625-24-24-24c-13.230469 0-24 10.769531-24 24s10.769531 24 24 24zm0-32c4.410156 0 8 3.585938 8 8s-3.589844 8-8 8c-4.40625 0-8-3.585938-8-8s3.59375-8 8-8zm0 0"></path><path d="m128 120c13.234375 0 24-10.769531 24-24s-10.765625-24-24-24c-13.230469 0-24 10.769531-24 24s10.769531 24 24 24zm0-32c4.410156 0 8 3.585938 8 8s-3.589844 8-8 8c-4.40625 0-8-3.585938-8-8s3.59375-8 8-8zm0 0"></path><path d="m336 296c-17.644531 0-32-14.351562-32-32s14.355469-32 32-32c17.648438 0 32 14.351562 32 32s-14.351562 32-32 32zm0 0" fill="#f0bc5e"></path></svg>`
                    );
                }}
            >
                <path
                    d="m286.761719 99.238281c-4.929688-25.382812-25.367188-45.535156-50.839844-50.167969-4.222656-.757812-8.390625-.964843-12.527344-.925781-3.847656-27.160156-27.191406-48.144531-55.394531-48.144531-14.503906 0-27.695312 5.59375-37.652344 14.671875-7.714844-4.128906-16.25-6.464844-25.121094-6.664063-11.121093-.214843-22.359374 3.832032-31.625 11.441407-21.085937 17.320312-25.769531 32.648437-25.609374 45.109375-12.207032 1.738281-23.429688 7.425781-32.183594 16.449218-10.628906 10.960938-16.238282 25.425782-15.7812502 40.710938.9023442 29.929688 26.9101562 54.28125 57.9921872 54.28125h93.980469v152c0 13.230469 10.769531 24 24 24 13.234375 0 24-10.769531 24-24v-9.472656c2.515625.898437 5.1875 1.472656 8 1.472656 13.234375 0 24-10.769531 24-24v-120.496094c16.128906-2.007812 30.90625-10.078125 41.410156-22.816406 12.207032-14.816406 17.078125-34.296875 13.351563-53.449219zm0 0"
                    fill="#f0bc5e"
                />
                <path d="m272 256c0 17.648438 14.355469 32 32 32 5.472656 0 10.761719-1.433594 15.722656-4.246094l-7.914062-13.90625c-2.519532 1.425782-5.144532 2.152344-7.808594 2.152344-8.820312 0-16-7.175781-16-16 0-2.222656.554688-4.34375 1.417969-6.320312 5.679687 6.761718 13.550781 11.695312 22.679687 13.527343l3.152344-15.6875c-11.152344-2.238281-19.25-12.128906-19.25-23.519531 0-13.230469 10.769531-24 24-24 13.234375 0 24 10.769531 24 24 0 4.910156-1.511719 9.664062-4.375 13.734375l13.089844 9.203125c4.765625-6.777344 7.285156-14.714844 7.285156-22.9375 0-22.054688-17.941406-40-40-40-22.054688 0-40 17.945312-40 40 0 3.289062.539062 6.457031 1.304688 9.535156-5.878907 5.945313-9.304688 13.960938-9.304688 22.464844zm0 0" />
                <path d="m435.90625 256.136719c17.839844-23.519531 32.550781-46.90625 42.992188-68.847657 20.832031-43.800781 22.617187-77.609374 5.023437-95.199218-17.601563-17.609375-51.40625-15.816406-95.207031 5.015625-22.273438 10.597656-46.023438 25.605469-69.914063 43.816406-13.75-10.523437-25.398437-19-31.175781-23.160156-.527344 5.839843-1.765625 11.550781-3.832031 16.992187 5.578125 4.070313 13.265625 9.757813 21.960937 16.367188-16.0625 13.03125-32.082031 27.429687-47.640625 42.992187-9.101562 9.09375-17.734375 18.472657-26.113281 27.917969v24.433594c11.59375-13.9375 24.128906-27.746094 37.425781-41.039063 16.136719-16.144531 32.753907-30.984375 49.359375-44.273437 18.160156 14.175781 38.105469 30.582031 51.792969 44.273437 15.886719 15.886719 31.167969 33.191407 45.023437 50.820313-13.480468 16.929687-28.566406 33.882812-45.023437 50.339844-16.550781 16.550781-33.625 31.71875-50.59375 45.207031-17.007813-13.527344-34.03125-28.671875-50.558594-45.207031-13.34375-13.355469-25.871093-27.152344-37.425781-41.042969v24.433593c8.363281 9.429688 16.984375 18.792969 26.113281 27.917969 15.929688 15.929688 32.335938 30.679688 48.785157 43.953125-40 29.785156-78.441407 49.28125-106.898438 53.328125v-87.175781c0 10.414062-6.710938 19.214844-16 22.527344v73.472656c0 30.871094-25.117188 56-56 56-30.878906 0-56-25.128906-56-56v-8h32v-16h-32v-16h48v-16h-48v-16h32v-16h-32v-16h48v-16h-48v-16h32v-16h-32v-16h48v-16h-48v-16h80v-16h-104c-4.40625 0-8-3.585938-8-8v-16c0-4.414062 3.59375-8 8-8h104v-16h-104c-13.230469 0-24 10.769531-24 24v16c0 13.230469 10.769531 24 24 24h8v200c0 39.703125 32.304688 72 72 72 37.21875 0 67.929688-28.382812 71.625-64.640625 32.570312-3.824219 75.777344-25.457031 120.417969-59.3125 23.460937 17.777344 46.773437 32.441406 68.664062 42.855469 23.839844 11.335937 44.71875 17.035156 61.640625 17.035156 14.167969 0 25.550782-3.992188 33.574219-12.015625 29.320313-29.328125 1.953125-97.457031-48.015625-163.785156zm-54.015625-62.023438c-13.519531-13.519531-32.425781-29.226562-50.058594-43.082031 21.839844-16.367188 43.457031-29.824219 63.746094-39.472656 36.671875-17.453125 64.75-20.414063 77.023437-8.160156 12.265626 12.265624 9.289063 40.335937-8.160156 77.027343-9.496094 19.957031-22.648437 41.207031-38.664062 62.6875-13.488282-16.847656-28.296875-33.417969-43.886719-49zm90.71875 214.488281c-12.261719 12.277344-40.335937 9.292969-77.023437-8.160156-19.921876-9.472656-41.121094-22.59375-62.566407-38.5625 16.375-13.207031 32.8125-27.925781 48.871094-43.992187 15.839844-15.839844 30.503906-32.152344 43.71875-48.503907 43.152344 58.425782 68.617187 117.601563 47 139.21875zm0 0" />
                <path d="m56 144c13.234375 0 24-10.769531 24-24s-10.765625-24-24-24c-13.230469 0-24 10.769531-24 24s10.769531 24 24 24zm0-32c4.410156 0 8 3.585938 8 8s-3.589844 8-8 8c-4.40625 0-8-3.585938-8-8s3.59375-8 8-8zm0 0" />
                <path d="m224 136c13.234375 0 24-10.769531 24-24s-10.765625-24-24-24c-13.230469 0-24 10.769531-24 24s10.769531 24 24 24zm0-32c4.410156 0 8 3.585938 8 8s-3.589844 8-8 8c-4.40625 0-8-3.585938-8-8s3.59375-8 8-8zm0 0" />
                <path d="m128 120c13.234375 0 24-10.769531 24-24s-10.765625-24-24-24c-13.230469 0-24 10.769531-24 24s10.769531 24 24 24zm0-32c4.410156 0 8 3.585938 8 8s-3.589844 8-8 8c-4.40625 0-8-3.585938-8-8s3.59375-8 8-8zm0 0" />
                <path
                    d="m336 296c-17.644531 0-32-14.351562-32-32s14.355469-32 32-32c17.648438 0 32 14.351562 32 32s-14.351562 32-32 32zm0 0"
                    fill="#f0bc5e"
                />
            </svg>,
            document.body
        );
    });
    test("svg image", () => {
        render(
            <svg
                width="200"
                height="200"
                onCreated={target => {
                    expect(target.outerHTML).toBe(
                        `<svg width="200" height="200"><image xlink:href="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png" height="200" width="200"></image></svg>`
                    );
                }}
            >
                <image
                    xlink="https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png"
                    height="200"
                    width="200"
                />
            </svg>,
            document.body
        );
    });
});
