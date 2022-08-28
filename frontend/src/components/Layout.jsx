import { Outlet } from "react-router-dom"

const Layout = () => {
    
  return (
    <div>
        <h3>sabit header</h3>
        <Outlet />
        <h4>sabit footer</h4>
    </div>
  )
}

export default Layout

//  An <Outlet> should be used in parent route elements to render their child route elements
// Outlet, bir route altında farklı bir route ( çocuk / child ) göstermek için kullanılır.
