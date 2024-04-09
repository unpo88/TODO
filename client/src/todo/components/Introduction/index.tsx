import { Flex, Typography } from "antd";
import _S from "./styles";

const { Title } = Typography;

interface Props {
  title: string;
  subTitle: string;
}

function Introduction({ title, subTitle }: Props): JSX.Element {
  return (
    <Flex gap="middle" align="center" wrap="wrap">
      <Title>{title}</Title>
      <Title level={5} css={_S.SubTextStyle}>
        {subTitle}
      </Title>
    </Flex>
  );
}

export default Introduction;
