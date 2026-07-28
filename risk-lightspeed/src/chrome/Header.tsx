import type { ReactElement } from 'react';
import {
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  PageToggleButton,
} from '@patternfly/react-core';

import BrandLogo from './BrandLogo';
import MastheadToolbar from './MastheadToolbar';

/** Ported from stackrox Containers/MainPage/Header/Header.tsx */
function Header(): ReactElement {
  return (
    <Masthead inset={{ default: 'insetNone' }}>
      <MastheadMain>
        <MastheadToggle className="pf-v6-u-pl-lg">
          <PageToggleButton isHamburgerButton variant="plain" />
        </MastheadToggle>
        <MastheadBrand data-codemods>
          <MastheadLogo data-codemods>
            <BrandLogo />
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent className="pf-v6-u-flex-grow-1 pf-v6-u-justify-content-flex-end pf-v6-u-pr-lg">
        <MastheadToolbar />
      </MastheadContent>
    </Masthead>
  );
}

export default Header;
