import { Menu } from "antd"
import { LogoutOutlined } from "@ant-design/icons"
import { removeToken } from "@/utils"
import { LogoutButton, NavBarDiv, NavBarMenuItem } from "./styles"
import { AdminNavbarItems } from "./items"
import Router from "next/router"
import Link from "next/link"
import { useCallback } from "react"

const NavBar = () => {
  const history = Router
  const activeKey = history.pathname.split("/")[2] || history.pathname.split("/")[1]

  const logout = useCallback(() => {
    removeToken("candidate-portal-token")
    history.push("/login")
  }, [history])

  return (
    <NavBarDiv>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[activeKey]}>
        {AdminNavbarItems?.map(({ key, label, path, icon }) => (
          <NavBarMenuItem key={key} icon={icon}>
            <Link href={path}>
              <p>{label}</p>
            </Link>
          </NavBarMenuItem>
        ))}
        <NavBarMenuItem key="Logout" icon={<LogoutOutlined />} onClick={logout}>
          <LogoutButton>Log Out</LogoutButton>
        </NavBarMenuItem>
      </Menu>
    </NavBarDiv>
  )
}

export default NavBar
