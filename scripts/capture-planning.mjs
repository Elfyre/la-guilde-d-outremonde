import { chromium } from "playwright";
import path from "node:path";
import { pathToFileURL } from "node:url";

const browser = await chromium.launch({ headless: true });

try {
    const page = await browser.newPage({
        viewport: {
            width: 1900,
            height: 1200
        },
        deviceScaleFactor: 1
    });

    const fichierHTML = path.resolve("pages/planning.html");

    await page.goto(pathToFileURL(fichierHTML).href, {
        waitUntil: "load"
    });

    await page.evaluate(async () => {
        await document.fonts.ready;

        const images = Array.from(document.images);

        await Promise.all(
            images.map(async (img) => {
                if (!img.complete) {
                    await new Promise((resolve) => {
                        img.addEventListener("load", resolve, { once: true });
                        img.addEventListener("error", resolve, { once: true });
                    });
                }

                if (img.complete && img.naturalWidth > 0) {
                    await img.decode().catch(() => {});
                }
            })
        );

        const style = document.createElement("style");

        style.textContent = `
            html,
            body {
                width: 100% !important;
                min-height: 0 !important;
                height: auto !important;
            }

            body {
                display: block !important;
            }

            main {
                flex: none !important;
                height: auto !important;
                min-height: 0 !important;
                overflow: visible !important;
            }

            .entete-salle h1,
            .entete-salle .embleme,
            .entete-salle .bouton-retour,
            .ornement,
            .pied-page {
                display: none !important;
            }

            .entete-salle {
                margin: 20px auto 15px !important;
            }

            .planning {
                margin-bottom: 20px !important;
            }

            *,
            *::before,
            *::after {
                animation: none !important;
                transition: none !important;
            }
        `;

        document.head.appendChild(style);
    });

    await page.locator("main").screenshot({
        path: "planning.png",
        animations: "disabled"
    });

    console.log("Image du planning générée : planning.png");
} finally {
    await browser.close();
}
