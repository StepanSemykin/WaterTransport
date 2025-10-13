import { useState } from "react";

import { Container, Nav, Navbar } from "react-bootstrap";

import styles from "./Navigation.module.css"

export function Navigation({ params })
{
  const keys = Object.keys(params);
  const [activeTab, setActiveTab] = useState(keys[0]);

    return (
      <>
        <Navbar bg="light" expand="md" className={styles["user-navbar"]}>
          <Container>
            <Nav
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className={styles["user-nav"]}
            >
              {keys.map((key) => (
                <Nav.Item key={key}>
                  <Nav.Link eventKey={key}>{params[key].label}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Container>
        </Navbar>

        <div className={styles["user-content"]}>
          {params[activeTab]?.component}
        </div>
      </>
    );
}