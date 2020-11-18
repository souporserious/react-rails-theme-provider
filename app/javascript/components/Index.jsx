import React from 'react'

import { AppContext } from '../packs/application'

function Index() {
  const appContext = React.useContext(AppContext)
  return (
    <div>
      <div>Hello World</div>
      <pre>{JSON.stringify(appContext, null, 2)}</pre>
    </div>
  )
}

export default Index
