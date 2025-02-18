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
  const array: any = [
    {
      id: "EST",
      label: "Eastern Standard Time (EST)",
      utcOffset: -5,
    },
    {
      id: "CST",
      label: "Central Standard Time (CST)",
      utcOffset: -6,
    },
    {
      id: "MST",
      label: "Mountain Standard Time (MST)",
      utcOffset: -7,
    },
    {
      id: "PST",
      label: "Pacific Standard Time (PST)",
      utcOffset: -8,
    },
    {
      id: "AKST",
      label: "Alaska Standard Time (AKST)",
      utcOffset: -9,
    },
    {
      id: "HAST",
      label: "Hawaii-Aleutian Standard Time (HAST)",
      utcOffset: -10,
    },
    {
      id: "AST",
      label: "Atlantic Standard Time (AST)",
      utcOffset: -4,
    },
    {
      id: "ChST",
      label: "Chamorro Standard Time (ChST)",
      utcOffset: 10,
    },
    {
      id: "SST",
      label: "Samoa Standard Time (SST)",
      utcOffset: -11,
    },
  ];

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

import { useState, useEffect } from "react";
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
import axios from "axios";
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { Walkthrough } from './page';

export default function CollapseRow({
  shortened = false,
  data = {},
  openDetails = false,
  onDetailsToggle,
  setDataState,
}: any) {
  const [urlEdit, setUrlEdit] = useState(false);
  const [shortName, setShortName] = useState("");
  // const { isOpen, onToggle } = useDisclosure(openDetails);

  // Vars
  const [checkedPasscode, setCheckedPasscode] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [checkedCaptcha, setCheckedCaptcha] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [checkedExpiry, setCheckedExpiry] = useState(false);
  const [expireTimezone, setExpireTimezone] = useState(
    getTimezones()[0].utcOffset
  );
  const [expireTime, setExpireTime] = useState("");
  const [checkedControl, setCheckedControl] = useState(false);
  // const [blockedCountries, setBlockedCountries] = useState([]);
  const [blockedCountries, setBlockedCountries] = useState<
    { value: string; label: string }[]
  >([]);
  const toast = useToast();
  const onURLEdit = () => {
    setShortName(data.shortPath);
    setUrlEdit(true);
  };

  const isOpen = openDetails;

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []); 

  const safeShortnerURL = `https://safe-shortner.vercel.app`;

  const urlWithShortPath = `${safeShortnerURL}/link/${data.shortPath}`;

  const updateShortName = async () => {
    if (!shortened) return;

    const payload = {
      id: data.id,
      shortPath: shortName,
    };

    try {
      const response = await axios.put("/api/shorten", { ...payload });
      console.log("Short URL updated:", response.data);
      showToast(
        "Updated!",
        `Short URL updated to ${safeShortnerURL}/link/${shortName}`,
        "success"
      );
      setUrlEdit(false);
      setDataState("shortPath", shortName);
    } catch (error) {
      console.error("Error updating short URL:", error);
      showToast(
        "Error",
        `Short path ${safeShortnerURL}/link/${shortName} already exists`
      );
    }
  };

  const showToast = (title: any, description: any, status: any = "error") => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };

  const handleUpdate = async () => {
    if (!shortened) {
      showToast("Error", "No URL data to update", "warning");
      return;
    }

    const payload = {
      id: data.id,
      checkedPasscode: checkedPasscode,
      passcode: passcode,
      checkedCaptcha: checkedCaptcha,
      captcha: captcha,
      checkedExpiry: checkedExpiry,
      expireTime: expireTime,
      expireTimezone: expireTimezone,
      checkedControl: checkedControl,
      blockedCountries: checkedControl
        ? blockedCountries.map((country) => country.value)
        : [],
    };

    //Validation for passcode
    if (checkedPasscode) {
      if (!passcode || passcode.length !== 6) {
        showToast("Invalid Passcode", "Provide a 6 digit passcode");
        return;
      }
    } else {
      payload.passcode = "";
    }

    //validation for captcha
    if (checkedCaptcha) {
      if (!captcha) {
        showToast("CAPTCHA Required", "CAPTCHA is required");
        return;
      }
    } else {
      payload.captcha = "";
    }

    //Validation for expiry
    if (checkedExpiry) {
      if (!expireTime) {
        showToast("Expiry Date Required", "Please select an expiry date");
        return;
      }
      const currentDate = new Date();
      const selectedDate = new Date(expireTime);
      currentDate.setHours(0, 0, 0, 0);
      if (selectedDate < currentDate) {
        showToast("Invalid Expiry Date", "Date cannot be past");
        return;
      }
    } else {
      payload.expireTime = "";
      payload.expireTimezone = null;
    }

    //Validation for blocked countries
    if (checkedControl) {
      if (!blockedCountries.length) {
        showToast(
          "Blocked Countries Required",
          "Please select at least one country"
        );
        return;
      }
    } else {
      payload.blockedCountries = [];
    }

    try {
      const response = await axios.put("/api/shorten", { ...payload });
      console.log("Short URL updated:", response.data);
      showToast("Updated!", `Security setting applied!`, "success");
    } catch (error) {
      console.error("Error updating short URL:", error);
      showToast(
        "Error",
        `Error occurred while updating security settings. Please try again.`
      );
    }
  };

  const handleReset = async () => {
    if (!shortened) {
      showToast("Error", "No URL data to reset", "warning");
      return;
    }

    setCheckedPasscode(false);
    setPasscode("");
    setCheckedCaptcha(false);
    setCaptcha("");
    setCheckedExpiry(false);
    setExpireTimezone(getTimezones()[0].utcOffset);
    setExpireTime("");
    setCheckedControl(false);
    setBlockedCountries([]);

    const payload = {
      id: data.id,
      checkedPasscode: false,
      passcode: "",
      checkedCaptcha: false,
      captcha: "",
      checkedExpiry: false,
      expireTime: "",
      expireTimezone: getTimezones()[0].utcOffset,
      checkedControl: false,
      blockedCountries: [],
    };

    try {
      const response = await axios.put("/api/shorten", payload);
      console.log("Data reset:", response.data);
      showToast("Updated!", `Security reset applied!`, "success");
    } catch (error) {
      showToast(
        "Error",
        `Error occurred while resetting security settings. Please try again.`
      );
    }
  };

  const handleCheckExpiry = (value: boolean) => {
    if (value) {
      const userTimeZoneOffset = new Date().getTimezoneOffset() / -60; // Get the offset in hours
      console.log("userTimeZoneOffset", userTimeZoneOffset);
      const timezones = getTimezones();
      const matchedTimezone =
        timezones.find((tz: any) => tz.utcOffset === userTimeZoneOffset) ||
        timezones[0];

      setExpireTimezone(matchedTimezone.utcOffset);
      setExpireTime("");
    }
    setCheckedExpiry(value);
  };

  const onCopy = (url: string) => {
    // Copy to clipboard
    if (!shortened) {
      showToast("Error", "No URL data to copy", "warning");
      return;
    }
    navigator.clipboard.writeText(url);
    showToast("Copied!", "Shortened URL copied to clipboard", "success");
  };

  return (
    <div className="collpserow">
      <Walkthrough />
      <div className="collpserow--head">
        <div className="collpserow--head--top">
          <div>
            {shortened ? (
              <div>
                {urlEdit ? (
                  <div className="flex items-center">
                    <div className="text-lg linkcolor">
                    {`${safeShortnerURL}/link/`}
                    </div>
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
                      onClick={() => updateShortName()}
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
                    <Link href={urlWithShortPath} isExternal>
                      <div className="text-lg linkcolor">
                        {urlWithShortPath}
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
            ) : (
              <div className="linkcolor">Shortened URL will be shown here</div>
            )}
          </div>
          <div>
            <Button
              className="shorten-url-copy"
              colorScheme="blue"
              size="md"
              rightIcon={<CopyIcon />}
              background="#1d85ac"
              onClick={() => onCopy(urlWithShortPath)}
            >
              Copy
            </Button>

            <Button
              className="ml-2 shorten-url-secure"
              size="md"
              rightIcon={isOpen ? <TriangleUpIcon /> : <TriangleDownIcon />}
              colorScheme="green"
              onClick={() => onDetailsToggle(!isOpen)}
            >
              Secure
            </Button>
          </div>
        </div>
        {shortened && (
          <div className="collpserow--head--bottom text-sm truncate ... w-3/4">
            <LinkIcon className="mr-2" />
            {data.originalUrl}
          </div>
        )}
      </div>

      <Collapse in={isOpen} animateOpacity>
        <div className="collpserow--body">
          <Box p="6" mt="4" bg="white" rounded="md" shadow="md">
            <CheckBoxWrapper
              className="shorten-url-secure-passcode"
              key="passcode"
              title="Apply Passcode"
              isChecked={checkedPasscode}
              onChange={(value: boolean) => setCheckedPasscode(value)}
            >
              <PinInput
                value={passcode}
                size="lg"
                onChange={(value) => {
                  setPasscode(value);
                }}
              >
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
              className="shorten-url-secure-captcha"
              key="captcha"
              title="Choose Captcha"
              isChecked={checkedCaptcha}
              onChange={(value: boolean) => {
                if (!captcha) setCaptcha("text");
                if (!value) setCaptcha("");
                setCheckedCaptcha(value);
              }}
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
              className="shorten-url-secure-expiry"
              key="expiry"
              title="Set Link Expiry"
              isChecked={checkedExpiry}
              onChange={(value: boolean) => handleCheckExpiry(value)}
            >
              <div className="flex">
                <div>
                  <div className="checkformtitle">Select the Timezone</div>
                  <div className="w-96 mt-1">
                    {isMounted ? (
                      <NewSelect
                        id={"timezone"}
                        menuPortalTarget={
                          typeof window !== "undefined" ? document.body : null
                        }
                        value={getTimezones().find(
                          ({ utcOffset }: any) => utcOffset == expireTimezone
                        )}
                        options={getTimezones()}
                        placeholder="Select Timezone..."
                        onChange={(value: any) => {
                          console.log("check...", value);
                          setExpireTimezone(value.utcOffset);
                        }}
                      />
                    ) : null}
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
                    onChange={(e: any) => {
                      console.log("e.target.value", e.target.value);
                      setExpireTime(e.target.value);
                    }}
                  />
                </div>
              </div>
            </CheckBoxWrapper>

            <Divider className="my-4" colorScheme="blue" />

            <CheckBoxWrapper
              className="shorten-url-secure-accesscontrol"
              key="control"
              title="Access Control"
              isChecked={checkedControl}
              onChange={(value: boolean) => setCheckedControl(value)}
            >
              <div>
                <div className="checkformtitle">Blacklisted Countries</div>

                {isMounted ? (
                  <NewSelect
                    id={"countries"}
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                    isMulti
                    value={blockedCountries}
                    options={getCountries()}
                    placeholder="Search and Select countries..."
                    onChange={(value: any) => {
                      console.log("check...", value);
                      setBlockedCountries(value);
                    }}
                  />
                ) : null}
              </div>
            </CheckBoxWrapper>

            <Divider className="my-4" colorScheme="blue" />
            <div className="flex justify-end ">
              <Button
                className="shorten-url-reset"
                colorScheme="teal"
                variant="ghost"
                onClick={() => handleReset()}
              >
                Reset All
              </Button>
              <Button
                className="ml-4 shorten-url-update"
                colorScheme="teal"
                variant="outline"
                onClick={() => handleUpdate()}
              >
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
