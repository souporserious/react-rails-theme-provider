import React from 'react'
import ReactDOM from 'react-dom'
import ReactRailsUJS from 'react_ujs'

export const ThemeContext = React.createContext({})

function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider
      value={{
        fontSizes: [12, 16, 18, 24, 32],
        spacings: [0, 4, 8, 16, 32, 64, 128],
        colors: { primary: 'blue', secondary: 'orange' },
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// modified from https://github.com/reactjs/react-rails/blob/master/react_ujs/index.js#L83-L121
ReactRailsUJS.mountComponents = (searchSelector) => {
  var ujs = ReactRailsUJS
  var nodes = ujs.findDOMNodes(searchSelector)

  for (var i = 0; i < nodes.length; ++i) {
    var node = nodes[i]
    var className = node.getAttribute(ujs.CLASS_NAME_ATTR)
    var constructor = ujs.getConstructor(className)
    var propsJson = node.getAttribute(ujs.PROPS_ATTR)
    var props = propsJson && JSON.parse(propsJson)
    var hydrate = node.getAttribute(ujs.RENDER_ATTR)
    var cacheId = node.getAttribute(ujs.CACHE_ID_ATTR)
    var turbolinksPermanent = node.hasAttribute(ujs.TURBOLINKS_PERMANENT_ATTR)

    if (!constructor) {
      var message = "Cannot find component: '" + className + "'"
      if (console && console.log) {
        console.log(
          '%c[react-rails] %c' + message + ' for element',
          'font-weight: bold',
          '',
          node
        )
      }
      throw new Error(
        message + '. Make sure your component is available to render.'
      )
    } else {
      var component = ujs.components[cacheId]
      if (component === undefined) {
        component = React.createElement(constructor, props)
        if (turbolinksPermanent) {
          ujs.components[cacheId] = component
        }
      }

      if (hydrate && typeof ReactDOM.hydrate === 'function') {
        component = ReactDOM.hydrate(
          <ThemeProvider>{component}</ThemeProvider>,
          node
        )
      } else {
        component = ReactDOM.render(
          <ThemeProvider>{component}</ThemeProvider>,
          node
        )
      }
    }
  }
}

ReactRailsUJS.useContext(require.context('components', true))
