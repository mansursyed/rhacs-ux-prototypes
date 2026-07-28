import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { Page } from '@patternfly/react-core';

import Header from './chrome/Header';
import HorizontalSubnav from './chrome/HorizontalSubnav';
import NavigationSidebar from './chrome/NavigationSidebar';
import PlaceholderPage from './chrome/PlaceholderPage';
import VersionSwitcher from './demo/VersionSwitcher';
import RiskDetailsPage from './Containers/Risk/RiskDetailsPage';
import RiskTablePage from './Containers/Risk/RiskTablePage';
import {
  accessControlBasePath,
  clustersBasePath,
  complianceBasePath,
  configManagementPath,
  dashboardPath,
  integrationsPath,
  listeningEndpointsBasePath,
  networkBasePath,
  policyManagementBasePath,
  riskBasePath,
  riskUserWorkloadsViewPath,
  riskWorkloadsBasePath,
  systemConfigPath,
  systemHealthPath,
  violationsBasePath,
  vulnManagementPath,
} from './routePaths';

const classicRiskListPath = `${riskUserWorkloadsViewPath}&prototype=baseline`;

function LegacyRiskDetailRedirect() {
  const { deploymentId } = useParams();
  return (
    <Navigate
      to={`${riskWorkloadsBasePath}/${deploymentId}?filteredWorkflowView=Applications view&prototype=baseline`}
      replace
    />
  );
}

export default function App() {
  return (
    <div id="PageParent">
      <Page
        mainContainerId="main-page-container"
        isManagedSidebar
        masthead={<Header />}
        sidebar={<NavigationSidebar />}
      >
        <HorizontalSubnav />
        <Routes>
          <Route path="/" element={<Navigate to={classicRiskListPath} replace />} />
          <Route path={riskBasePath} element={<Navigate to={classicRiskListPath} replace />} />
          <Route path={riskWorkloadsBasePath} element={<RiskTablePage />} />
          <Route
            path={`${riskWorkloadsBasePath}/:deploymentId`}
            element={<RiskDetailsPage />}
          />
          {/* Legacy /main/risk/:id → classic /main/risk/workloads/:id */}
          <Route
            path={`${riskBasePath}/:deploymentId`}
            element={<LegacyRiskDetailRedirect />}
          />
          <Route path={dashboardPath} element={<PlaceholderPage title="Dashboard" />} />
          <Route path={networkBasePath} element={<PlaceholderPage title="Network Graph" />} />
          <Route
            path={listeningEndpointsBasePath}
            element={<PlaceholderPage title="Listening Endpoints" />}
          />
          <Route path={violationsBasePath} element={<PlaceholderPage title="Violations" />} />
          <Route path={`${complianceBasePath}/*`} element={<PlaceholderPage title="Compliance" />} />
          <Route
            path={`${vulnManagementPath}/*`}
            element={<PlaceholderPage title="Vulnerability Management" />}
          />
          <Route
            path={configManagementPath}
            element={<PlaceholderPage title="Configuration Management" />}
          />
          <Route path={clustersBasePath} element={<PlaceholderPage title="Clusters" />} />
          <Route
            path={`${policyManagementBasePath}/*`}
            element={<PlaceholderPage title="Policy Management" />}
          />
          <Route path={integrationsPath} element={<PlaceholderPage title="Integrations" />} />
          <Route path={accessControlBasePath} element={<PlaceholderPage title="Access Control" />} />
          <Route
            path={systemConfigPath}
            element={<PlaceholderPage title="System Configuration" />}
          />
          <Route path={systemHealthPath} element={<PlaceholderPage title="System Health" />} />
          <Route path="*" element={<Navigate to={classicRiskListPath} replace />} />
        </Routes>
      </Page>
      <div className="acs-prototype-dock" data-testid="prototype-dock">
        <VersionSwitcher />
      </div>
    </div>
  );
}
