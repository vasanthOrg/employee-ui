import ReactDOM from 'react-dom'
import { Suspense, lazy } from 'react'

import { Spinner } from 'reactstrap';

const LazyApp = lazy(() => import('./App'));

ReactDOM.render(
  <Suspense fallback={
    <div className='loaderDiv'>
        <Spinner
          color="primary"
      >
      </Spinner>
    </div>
  }
  >
    <LazyApp />
  </Suspense>,
  document.getElementById('root')
);

