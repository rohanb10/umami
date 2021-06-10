import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import WebsiteChart from 'components/metrics/WebsiteChart';
import WorldMap from 'components/common/WorldMap';
import Page from 'components/layout/Page';
import GridLayout, { GridRow, GridColumn } from 'components/layout/GridLayout';
import MenuLayout from 'components/layout/MenuLayout';
import Link from 'components/common/Link';
import Loading from 'components/common/Loading';
import Arrow from 'assets/arrow-right.svg';
import styles from './WebsiteDetails.module.css';
import PagesTable from '../metrics/PagesTable';
import ReferrersTable from '../metrics/ReferrersTable';
import BrowsersTable from '../metrics/BrowsersTable';
import OSTable from '../metrics/OSTable';
import DevicesTable from '../metrics/DevicesTable';
import CountriesTable from '../metrics/CountriesTable';
import EventsTable from '../metrics/EventsTable';
import EventsChart from '../metrics/EventsChart';
import useFetch from 'hooks/useFetch';
import usePageQuery from 'hooks/usePageQuery';
import useShareToken from 'hooks/useShareToken';
import { DEFAULT_ANIMATION_DURATION, TOKEN_HEADER } from 'lib/constants';

const views = {
  url: PagesTable,
  referrer: ReferrersTable,
  browser: BrowsersTable,
  os: OSTable,
  device: DevicesTable,
  country: CountriesTable,
  event: EventsTable,
};

export default function WebsiteDetails({ websiteId }) {
  const shareToken = useShareToken();
  const { data } = useFetch(`/api/website/${websiteId}`, {
    headers: { [TOKEN_HEADER]: shareToken?.token },
  });
  const [chartLoaded, setChartLoaded] = useState(false);
  const [countryData, setCountryData] = useState();
  const [eventsData, setEventsData] = useState();
  const {
    resolve,
    query: { view },
  } = usePageQuery();

  const BackButton = () => (
    <div key="back-button" className={styles.backButton}>
      <Link key="back-button" href={resolve({ view: undefined })} icon={<Arrow />} size="small">
        <FormattedMessage id="label.back" defaultMessage="Back" />
      </Link>
    </div>
  );

  const menuOptions = [
    {
      render: BackButton,
    },
    {
      label: <FormattedMessage id="metrics.pages" defaultMessage="Pages" />,
      value: resolve({ view: 'url' }),
    },
    {
      label: <FormattedMessage id="metrics.referrers" defaultMessage="Referrers" />,
      value: resolve({ view: 'referrer' }),
    },
    {
      label: <FormattedMessage id="metrics.browsers" defaultMessage="Browsers" />,
      value: resolve({ view: 'browser' }),
    },
    {
      label: <FormattedMessage id="metrics.operating-systems" defaultMessage="Operating system" />,
      value: resolve({ view: 'os' }),
    },
    {
      label: <FormattedMessage id="metrics.devices" defaultMessage="Devices" />,
      value: resolve({ view: 'device' }),
    },
    {
      label: <FormattedMessage id="metrics.countries" defaultMessage="Countries" />,
      value: resolve({ view: 'country' }),
    },
    {
      label: <FormattedMessage id="metrics.events" defaultMessage="Events" />,
      value: resolve({ view: 'event' }),
    },
  ];

  const tableProps = {
    websiteId,
    websiteDomain: data?.domain,
    limit: 10,
  };

  const DetailsComponent = views[view];

  function handleDataLoad() {
    if (!chartLoaded) {
      setTimeout(() => setChartLoaded(true), DEFAULT_ANIMATION_DURATION);
    }
  }

  if (!data) {
    return null;
  }

  return (
    <Page>
      <GridLayout>
        <GridRow>
          <GridColumn md={12} lg={2}></GridColumn>
          <GridColumn md={12} lg={8}>
            <EventsTable {...tableProps} onDataLoad={setEventsData} />
          </GridColumn>
          <GridColumn md={12} lg={2}></GridColumn>
        </GridRow>
      </GridLayout>
    </Page>
  );
}
