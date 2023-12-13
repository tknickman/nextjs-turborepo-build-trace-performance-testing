import { GetStaticProps } from "next";

type Props = {
  heroText: string;
};

const SSGPage = ({ heroText }: Props) => {
  return (
    <div className="bg-slate-800 h-screen px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-6xl">
          {heroText}
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Check out this demo here 🚀
        </p>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      heroText: process.env.HEADER_TEXT ?? "Hello, World!"
    },
  };
};

export default SSGPage;
