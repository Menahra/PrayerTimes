import { Button, Flex, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { MdLocationPin } from "react-icons/md";
import { useT } from "talkr";
import { useGetReverseGeocoding } from "../../api";
import { LoadingIndicator } from "../loading-indicator/LoadingIndicator";

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
	const { T } = useT();
	const { data, isFetching, isSuccess } = useGetReverseGeocoding(
		longitude,
		latitude,
	);

	if (isFetching) {
		return <LoadingIndicator />;
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
		<Button type="text" onClick={() => onUndoLocationClick()}>
			{T("reversedGeoLocatedText.fallbackText")}
		</Button>
	);
};
