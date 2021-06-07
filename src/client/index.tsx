import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import './assets/custom.scss'
import 'fomantic-ui-css/semantic.min.css'
import App from 'Components/App'

const queryClient = new QueryClient()

const refresh = () => render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>,
  document.getElementById('root')
)

refresh()

if (module.hot) {
  module.hot.accept()
}
