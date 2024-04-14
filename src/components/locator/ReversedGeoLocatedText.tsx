import { Button, Flex, Spin, Typography } from "antd";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { MdLocationPin } from "react-icons/md";
import { useGetReverseGeocoding } from "../../api";

const { Title } = Typography;

type ReversedGeoLocatedTextProps = {
	latitude: number;
	longitude: number;
	/** callback executed when the user decides to undo the automatic location */
	onUndoLocationClick: () => void;
};

export const ReversedGeoLocatedText = ({
	latitude,
	longitude,
	onUndoLocationClick,
}: ReversedGeoLocatedTextProps) => {
	const { data, isFetching, isSuccess } = useGetReverseGeocoding(
		longitude,
		latitude,
	);

	if (isFetching) {
		return <Spin indicator={<LoadingOutlined spin />} />;
	}

	if (isSuccess) {
		return (
			<Flex gap="middle" align="center">
				<Flex align="center">
					<MdLocationPin />
					<Title level={5} style={{ margin: 0 }}>
						{data.results[0].city}
					</Title>
				</Flex>
				<Button
					type="text"
					icon={<CloseOutlined />}
					style={{ width: "24px", height: "24px" }}
					onClick={() => onUndoLocationClick()}
				/>
			</Flex>
		);
	}

	return (
		<Button
			type="text"
			onClick={() => onUndoLocationClick}
			style={{ width: "24px", height: "24px" }}
		>
			Failed to locate you. Click here to choose your location manually.
		</Button>
	);
};
