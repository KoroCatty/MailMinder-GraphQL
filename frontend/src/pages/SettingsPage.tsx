// component:
import SettingsForms from "../components/features/settings/SettingsForms"
import EmailToggle from "../components/features/settings/EmailToggle"
import SettingsAvatar from "../components/features/settings/SettingsAvatar"

// bootstrap
import { Container } from "react-bootstrap"

const Settings = () => {
  return (
    <main>
      <Container>
      <h1 className="text-center">Settings</h1>
        <SettingsForms />
        <EmailToggle />
        <SettingsAvatar />
      </Container>
    </main>
  )
}

export default Settings