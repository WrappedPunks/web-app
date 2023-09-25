import { createIcon } from "@chakra-ui/react";

const LightBulb = createIcon({
  viewBox: "0 0 45 45",
  defaultProps: {
    fill: "none",
  },
  path: (
    <>
      <circle cx="22.5" cy="22.5" r="22.5" fill="currentColor" />
      <path
        d="M27.0806 31.7803C27.0806 33.0001 26.0807 34 24.8408 34H21.1612C20.0814 34 18.9215 33.2001 18.9215 31.4203V30.3404H27.0806V31.7803ZM28.7004 25.8609C27.8605 26.5408 27.3205 27.4207 27.1406 28.3406H18.8815C18.7415 27.4407 18.2416 26.6008 17.4217 25.9609C15.2019 24.2211 13.9421 21.6014 14.002 18.7617C14.102 14.0023 18.0816 10.0627 22.8611 10.0027C25.2808 9.94271 27.6005 10.8826 29.3403 12.6024C31.0601 14.2822 32 16.542 32 18.9417C32 21.6414 30.8022 24.1611 28.7004 25.8609Z"
        fill="white"
      />
    </>
  ),
});

export default LightBulb;
