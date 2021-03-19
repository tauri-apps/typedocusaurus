"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const events_1 = require("typedoc/dist/lib/output/events");
const ts = require("typescript");
async function render(project, outputDirectory) {
    var _a;
    if (!this.prepareTheme() || !this.prepareOutputDirectory(outputDirectory)) {
        return;
    }
    const output = new events_1.RendererEvent(events_1.RendererEvent.BEGIN, outputDirectory, project);
    output.settings = this.application.options.getRawValues();
    output.urls = this.theme.getUrls(project);
    this.trigger(output);
    if (!output.isDefaultPrevented) {
        (_a = output.urls) === null || _a === void 0 ? void 0 : _a.forEach((mapping, i) => {
            var _a;
            this.renderDocument(output.createPageEvent(mapping));
            ts.sys.write(`\rGenerated ${i + 1} of ${(_a = output.urls) === null || _a === void 0 ? void 0 : _a.length} TypeDoc docs`);
        });
        ts.sys.write(`\n`);
        this.trigger(events_1.RendererEvent.END, output);
    }
}
exports.render = render;
