import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export const LoadingIndicator = () => (
	<Spin indicator={<LoadingOutlined spin />} />
);
