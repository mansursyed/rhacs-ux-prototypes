/**
 * Mirrors stackrox/ui/apps/platform/src/css.imports.ts (minus toastify/charts/Tailwind).
 * Order matters: PF base → utilities → ACS theme/overrides.
 */
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/react-styles/css/utilities/Accessibility/accessibility.css';
import '@patternfly/react-styles/css/utilities/Alignment/alignment.css';
import '@patternfly/react-styles/css/utilities/BackgroundColor/background-color.css';
import '@patternfly/react-styles/css/utilities/BoxShadow/box-shadow.css';
import '@patternfly/react-styles/css/utilities/Display/display.css';
import '@patternfly/react-styles/css/utilities/Flex/flex.css';
import '@patternfly/react-styles/css/utilities/Sizing/sizing.css';
import '@patternfly/react-styles/css/utilities/Spacing/spacing.css';
import '@patternfly/react-styles/css/utilities/Text/text.css';

import './css/style.css';
import './css/light.theme.css';
import './css/acs.css';
import './css/trumps.css';
