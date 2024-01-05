import Image from "next/image";
import Link from "next/link";

const footerMenus = [
  {
    title: "Company",
    links: [
      {
        label: "About",
        url: "https://www.spotify.com/id-en/about-us/contact/",
      },
      {
        label: "Jobs",
        url: "https://www.spotify.com/id-en/jobs/",
      },
      {
        label: "For the Record",
        url: "https://newsroom.spotify.com/",
      },
    ],
  },
  {
    title: "Communities",
    links: [
      {
        label: "For Artists",
        url: "https://artists.spotify.com/",
      },
      {
        label: "Developers",
        url: "https://developers.spotify.com/",
      },
      {
        label: "Advertise",
        url: "https://ads.spotify.com/",
      },
      {
        label: "Investors",
        url: "https://investors.spotify.com/",
      },
      {
        label: "Vendors",
        url: "https://spotifyforvendors.com/",
      },
    ],
  },
  {
    title: "Useful Links",
    links: [
      {
        label: "Help",
        url: "https://www.spotify.com/id-en/help/",
      },
      {
        label: "Free Mobile App",
        url: "https://www.spotify.com/id-en/download/",
      },
    ],
  },
];

const bottomMenus = [
  {
    label: "Legal",
    url: "https://www.spotify.com/id-en/legal/privacy-policy/",
  },
  {
    label: "Cookies",
    url: "https://www.spotify.com/id-en/legal/cookies-policy/",
  },
  {
    label: "Privacy Policy",
    url: "https://www.spotify.com/id-en/legal/privacy-policy/",
  },
  {
    label: "Privacy Center",
    url: "https://www.spotify.com/id-en/privacy/",
  },
  {
    label: "About Ads",
    url: "https://www.spotify.com/id-en/legal/privacy-policy/#s3",
  },
  {
    label: "Accessibility",
    url: "https://www.spotify.com/id-en/accessibility/",
  },
];

const Footer = () => {
  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-start flex-wrap sm:flex-nowrap space-y-6 border-b border-neutral-800 pb-14">
        <div className="flex w-full md:w-[65%] xl:w-1/2 justify-between">
          {footerMenus.map((menu) => (
            <div key={menu.title} className="flex flex-col space-y-4">
              <h4 className="font-semibold text-white">{menu.title}</h4>
              {menu.links.map((link) => (
                <Link
                  className="hover:text-white hover:underline text-neutral-400 text-sm transition-colors duration-200"
                  target="_blank"
                  key={link.label}
                  href={link.url}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="flex gap-4 items-center">
          <Link
            href="https://www.instagram.com/azissmm_/"
            target="_blank"
            className="rounded-full bg-neutral-900 hover:bg-neutral-700 h-10 w-10 text-white p-2 flex justify-center items-center"
          >
            <Image
              src="/instagram.svg"
              alt="instagram"
              width={30}
              height={30}
            />
          </Link>
          <Link
            href="https://linkedin.com/in/azis-maulana-malik"
            target="_blank"
            className="rounded-full bg-neutral-900 hover:bg-neutral-700 h-10 w-10 text-white p-2 flex justify-center items-center"
          >
            <Image
              src="/linkedin.svg"
              alt="linkedIn"
              width={25}
              height={25}
              className="w-5 h-5"
            />
          </Link>
          <Link
            href="https://github.com/azismaulik"
            target="_blank"
            className="rounded-full bg-neutral-900 hover:bg-neutral-700 h-10 w-10 text-white p-2 flex justify-center items-center"
          >
            <Image
              src="/github.svg"
              alt="Github"
              width={25}
              height={25}
              className="w-6 h-6"
            />
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center flex-wrap sm:flex-nowrap space-y-6 py-10">
        <div className="mt-8 flex gap-4 items-center">
          {bottomMenus.map((menu) => (
            <Link
              key={menu.label}
              href={menu.url}
              target="_blank"
              className="hover:text-white hover:underline text-neutral-400 text-sm transition-colors duration-200"
            >
              {menu.label}
            </Link>
          ))}
        </div>
        <h1 className="text-neutral-400 text-sm">&copy; 2024 Spotizis</h1>
      </div>
    </div>
  );
};

export default Footer;
