import { DetailsPagePlugin } from './types';
import YamlLinter from './components/Plugins/YamlLinter';

/**
 * Plugin Registry for the Model Details Page
 *
 * To add a new tab to the Model Details page, simply add a new
 * object to this array that conforms to the `DetailsPagePlugin` interface.
 *
 * 1. Create your component in the `src/components/Plugins` directory.
 * 2. Import it here.
 * 3. Add it to the `detailsPagePlugins` array below.
 *
 * The `ModelDetailsPage` component will automatically pick up the new plugin
 * and render it as a new tab.
 */
export const detailsPagePlugins: DetailsPagePlugin[] = [
  {
    id: 'yaml-linter',
    tabName: 'YAML Linter',
    component: YamlLinter,
  },
  // Add other plugins here in the future
];
