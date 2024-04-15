"use client";
import "./landing-page.scss";
import Image from "next/image";
const ct = require("countries-and-timezones");

import {
  GroupBase,
  OptionBase,
  Select as NewSelect,
} from "chakra-react-select";

const getTimezones = () => {
  const timezonesObj = ct.getAllTimezones();
  const array: any = [];
  for (let key in timezonesObj) {
    array.push({
      id: timezonesObj[key].name,
      label: `${timezonesObj[key].name} (${timezonesObj[key].utcOffsetStr})`,
      value: timezonesObj[key].utcOffsetStr,
    });
  }
  return array;
};

const getCountries = () => {
  const countriesObj = ct.getAllCountries();
  const array: any = [];
  for (let key in countriesObj) {
    array.push({
      value: countriesObj[key].id,
      label: countriesObj[key].name,
    });
  }
  return array;
};

import { useState, useRef } from "react";
import {
  Button,
  Link,
  Divider,
  Input,
  useToast,
  useDisclosure,
  Collapse,
  Box,
  Checkbox,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import {
  CopyIcon,
  TriangleDownIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
  LinkIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import textcaptcha from "../../public/textcaptcha.jpg";
import cellcaptcha from "../../public/cellcaptcha.jpg";
export default function CollapseRow() {
  const [urlEdit, setUrlEdit] = useState(false);
  const [shortName, setShortName] = useState("");
  const { isOpen, onToggle } = useDisclosure();

  // Vars
  const [checkedPasscode, setCheckedPasscode] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [checkedCaptcha, setCheckedCaptcha] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [checkedExpiry, setCheckedExpiry] = useState(false);
  const [expireTimezone, setExpireTimezone] = useState(null);
  const [expireTime, setExpireTime] = useState("");
  const [checkedControl, setCheckedControl] = useState(false);
  const [blockedCountries, setBlockedCountries] = useState([]);
  const onURLEdit = () => {
    setUrlEdit(true);
  };

  return (
    <div className="collpserow">
      <div className="collpserow--head">
        <div className="collpserow--head--top">
          <div>
            {urlEdit ? (
              <div className="flex items-center">
                <div className="text-lg linkcolor">SafeShortner.com/link/</div>
                <Input
                  value={shortName}
                  variant="outline"
                  placeholder="Enter Custom Name"
                  background={"white"}
                  size="sm"
                  paddingLeft="4px"
                  borderRadius="0"
                  autoFocus
                  onChange={(e: any) => setShortName(e.target.value)}
                />
                <Button
                  colorScheme="teal"
                  size="sm"
                  borderRadius="0"
                  background="#61d79f"
                  _hover={{
                    background: "#1ed66d",
                  }}
                  onClick={() => {}}
                >
                  <CheckIcon />
                </Button>
                <Button
                  colorScheme="orange"
                  size="sm"
                  borderRadius="0"
                  background="#f3af57"
                  _hover={{
                    background: "#f7a235",
                  }}
                  onClick={() => setUrlEdit(false)}
                >
                  <CloseIcon />
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <Link href="https://SafeShortner.com/link/123dffd" isExternal>
                  <div className="text-lg linkcolor">
                    SafeShortner.com/link/123dffd
                  </div>
                </Link>

                <EditIcon
                  focusable
                  className="ml-2"
                  color="#093666"
                  _hover={{ cursor: "pointer" }}
                  onClick={() => onURLEdit()}
                />
              </div>
            )}
          </div>
          <div>
            <Button
              colorScheme="blue"
              size="md"
              rightIcon={<CopyIcon />}
              background="#1d85ac"
              onClick={() => {}}
            >
              Copy
            </Button>

            <Button
              className="ml-2"
              size="md"
              rightIcon={isOpen ? <TriangleUpIcon /> : <TriangleDownIcon />}
              colorScheme="green"
              onClick={onToggle}
            >
              Secure
            </Button>
          </div>
        </div>
        <div className="collpserow--head--bottom text-sm truncate ... w-3/4">
          <LinkIcon className="mr-2" />
          {"https://v2.chakra-ui.com/docs/components/icon/usage/docs/"}
        </div>
      </div>

      <Collapse in={isOpen || true} animateOpacity>
        <div className="collpserow--body">
          <Box p="6" mt="4" bg="white" rounded="md" shadow="md">
            <CheckBoxWrapper
              title="Apply Passcode"
              isChecked={checkedPasscode}
              onChange={(value: boolean) => setCheckedPasscode(value)}
            >
              <PinInput size="lg">
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </CheckBoxWrapper>

            <Divider className="my-4" colorScheme="blue" />

            <CheckBoxWrapper
              title="Choose Captcha"
              isChecked={checkedCaptcha}
              onChange={(value: boolean) => setCheckedCaptcha(value)}
            >
              <div className="flex">
                <Box
                  boxShadow={captcha == "text" ? "lg" : ""}
                  bg="white"
                  onClick={() => setCaptcha("text")}
                  _hover={{ cursor: "pointer" }}
                  border={
                    captcha == "text"
                      ? "2px solid #51c9f1"
                      : "2px solid lightgray"
                  }
                  borderRadius="8px"
                >
                  <Image
                    style={{ borderRadius: "8px" }}
                    src={textcaptcha}
                    height={100}
                    alt="text captcha "
                  />
                </Box>

                <Box
                  boxShadow={captcha == "cell" ? "lg" : ""}
                  bg="white"
                  onClick={() => setCaptcha("cell")}
                  className="ml-4"
                  _hover={{ cursor: "pointer" }}
                  border={
                    captcha == "cell"
                      ? "2px solid #51c9f1"
                      : "2px solid lightgray"
                  }
                  borderRadius="8px"
                >
                  <Image
                    style={{ borderRadius: "8px" }}
                    src={cellcaptcha}
                    height={100}
                    alt="cell captcha"
                  />
                </Box>
              </div>
            </CheckBoxWrapper>

            <Divider className="my-4" colorScheme="blue" />

            <CheckBoxWrapper
              title="Set Link Expiry"
              isChecked={checkedExpiry}
              onChange={(value: boolean) => setCheckedExpiry(value)}
            >
              <div className="flex">
                <div>
                  <div className="checkformtitle">Select the Timezone</div>
                  <div className="w-96 mt-1">
                    <NewSelect
                      menuPortalTarget={document.body}
                      value={expireTimezone}
                      options={getTimezones()}
                      placeholder="Select Timezone..."
                      onChange={(value: any) => {
                        console.log("check...", value);
                        setExpireTimezone(value);
                      }}
                    />
                  </div>
                </div>

                <div className="w-1/2 pl-4">
                  <div className="checkformtitle">Valid till</div>
                  <Input
                    placeholder="Select Expiry Date and Time"
                    size="md"
                    type="datetime-local"
                    className="mt-1"
                    value={expireTime}
                    onChange={(e: any) => setExpireTime(e.target.value)}
                  />
                </div>
              </div>
            </CheckBoxWrapper>

            <Divider className="my-4" colorScheme="blue" />

            <CheckBoxWrapper
              title="Access Control"
              isChecked={checkedControl}
              onChange={(value: boolean) => setCheckedControl(value)}
            >
              <div>
                <div className="checkformtitle">Blacklisted Countries</div>

                <NewSelect
                  menuPortalTarget={document.body}
                  isMulti
                  value={blockedCountries}
                  options={getCountries()}
                  placeholder="Search and Select countries..."
                  onChange={(value: any) => {
                    console.log("check...", value);
                    setBlockedCountries(value);
                  }}
                />
              </div>
            </CheckBoxWrapper>

            <Divider className="my-4" colorScheme="blue" />
            <div className="flex justify-end">
              <Button colorScheme="teal" variant="ghost">
                Reset All
              </Button>
              <Button colorScheme="teal" variant="outline" className="ml-4">
                Update
              </Button>
            </div>
          </Box>
        </div>
      </Collapse>
    </div>
  );
}

const CheckBoxWrapper = ({
  title = "",
  isChecked = false,
  onChange,
  children,
}: any) => {
  return (
    <div className="flex flex-col">
      <Checkbox
        isChecked={isChecked}
        size="lg"
        colorScheme="green"
        onChange={(event) => {
          console.log(event.target.checked);
          onChange(!isChecked);
        }}
      >
        <div
          className={`font-${
            isChecked ? "bold" : "medium"
          } text-lg pl-4 checktitle`}
        >
          {title}
        </div>
      </Checkbox>
      <div className={`${isChecked ? "" : "disabled-area "} pl-12 pt-4`}>
        {children}
      </div>
    </div>
  );
};
