import Head from "components/head";
import Layout from "components/layout";
import { CompaniesHeadline } from "components/headline";
import CompanyListItem from "components/company-list-item";
import { getCompanies } from "pages/api/companies";

const monthInMilliseconds = 1000 * 60 * 60 * 24 * 30;

export async function getStaticProps() {
  const allCompanies = getCompanies();
  const recentlyAddedCompanies = allCompanies
    .filter((company) => company.createdAt + monthInMilliseconds > Date.now())
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const otherCompanies = allCompanies
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .filter(
      (company) => !recentlyAddedCompanies.find((x) => x.id === company.id)
    );
  return {
    props: {
      recentlyAddedCompanies,
      otherCompanies,
    },
  };
}

export default function Companies({ recentlyAddedCompanies, otherCompanies }) {
  return (
    <Layout>
      <Head
        title="Full-remote and remote-friendly companies | Remotebear"
        description="Remotebear's catalog of full-remote and remote-friendly companies and startup."
        pathname="/companies"
      />
      <CompaniesHeadline />
      <div className="flex-col">
        {recentlyAddedCompanies.map((company) => (
          <CompanyListItem key={company.id} company={company} recentlyAdded />
        ))}
        {otherCompanies.map((company) => (
          <CompanyListItem key={company.id} company={company} />
        ))}
      </div>
    </Layout>
  );
}
