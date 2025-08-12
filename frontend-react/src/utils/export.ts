import { dump } from 'js-yaml';

/**
 * Triggers a browser download for a given JavaScript object or array as a YAML file.
 * @param data The JavaScript object or array of objects to export.
 *- * @param filename The desired name of the downloaded file (e.g., 'model.yaml').
 */
export const downloadYaml = (data: any, filename: string) => {
  // Convert the JS object to a YAML string.
  // For arrays of objects, js-yaml will create a multi-document YAML file with '---' separators.
  const yamlString = Array.isArray(data)
    ? data.map(item => dump(item)).join('---\n')
    : dump(data);

  // Create a Blob from the YAML string
  const blob = new Blob([yamlString], { type: 'text/yaml;charset=utf-8;' });

  // Create a link element to trigger the download
  const link = document.createElement('a');

  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);

  // Make the link invisible
  link.style.visibility = 'hidden';

  // Append the link to the body, click it, and then remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the blob URL
  URL.revokeObjectURL(url);
};
