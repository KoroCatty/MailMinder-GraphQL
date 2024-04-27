import { useState } from "react";

import { Form, Button } from "react-bootstrap";

import { css } from "@emotion/react";
const settingsFormsStyles = css`
  margin: 60px 0;
`;

const SettingsForms = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email);
    // 例えば、APIへの登録リクエストを行うなどの処理をここに追加できます。
  };

  return (
    <section css={settingsFormsStyles}>
      <h2>Change Email Address</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
      <hr />
    </section>
  );
};

export default SettingsForms;
