import {
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

export const SimpleModal = (props: {
  isOpen: boolean;
  onClose: any;
  headerText: string;
  description: string;
  children?: React.ReactNode;
}) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size={"md"} isCentered>
      <ModalOverlay />
      <ModalContent
        className="bg-gray-700"
        style={{
          padding: "24px",
          borderRadius: "16px",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2D3748",
        }}
      >
        <ModalHeader>
          <Center>
            <Text className="header-light text-white">
              {" "}
              {props.headerText}{" "}
            </Text>
          </Center>
        </ModalHeader>
        <ModalBody>
          <Text
            className="text-gray-400"
            style={{
              textAlign: "center",
            }}
          >
            {props.description}
          </Text>
          {props.children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
