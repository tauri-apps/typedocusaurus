// @ts-ignore
import { ProjectReflection, UrlMapping } from 'typedoc';
// @ts-ignore
import { RendererEvent } from 'typedoc/dist/lib/output/events';

export async function render(
  project: ProjectReflection,
  outputDirectory: string,
) {
  if (!this.prepareTheme() || !this.prepareOutputDirectory(outputDirectory)) {
    return;
  }

  const output = new RendererEvent(
    RendererEvent.BEGIN,
    outputDirectory,
    project,
  );

  output.settings = this.application.options.getRawValues();
  output.urls = this.theme!.getUrls(project);

  this.trigger(output);

  if (!output.isDefaultPrevented) {
    output.urls?.forEach((mapping: UrlMapping, i) => {
      this.renderDocument(output.createPageEvent(mapping));
      console.log(
        `\rGenerated ${i + 1} of ${output.urls?.length} TypeDoc docs`,
      );
    });
    console.log(`\n`);
    this.trigger(RendererEvent.END, output);
  }
}
