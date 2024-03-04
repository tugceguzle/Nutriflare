import { ok, userSvg, recipeSvg, sizeSvg, weightSvg } from "../Svg.js";
import Gender from "../Graph/Gender";
import Weight from "../Graph/Weight";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipesAll, fetchUserAll } from "../../api";
import Loading from "../../components/Loading";

function AdminHome() {
  const {
    usersIsPending,
    usersError,
    data: users,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUserAll,
  });

  const {
    recipesIsPending,
    recipesError,
    data: recipes,
  } = useQuery({
    queryKey: ["recipes"],
    queryFn: fetchRecipesAll,
  });


  if (usersIsPending || recipesIsPending ) return <Loading />;

  if (usersError || recipesError) return "An error has occurred: " + usersError ? usersError.message : recipesError.message;

  const userlist = users && users.filter(user => user.role === "user");
  if (!users || !recipes || !userlist || users.length === 0 || recipes.length === 0 || userlist.length === 0) {
    return "No data available.";
  }

  const totalWeight = userlist.reduce((total, user) => total + user.weight_kg, 0);
  const totalSize = userlist.reduce((total, user) => total + user.size_cm, 0);
  const averageWeight = (totalWeight / userlist.length || 1).toFixed(2);
  const averageSize = (totalSize / userlist.length || 1).toFixed(2);


  return (
    <>
      <section className="ad-sec">
        <div className="ad-cont">
          <div className="ad-flex">
            <div className="p-4 lg:w-1/2">
              <div className="ad-div-three">
                <div className="ad-div-two">
                  <div className="ad-graph">
                    <Weight></Weight>
                  </div>
                  <div className="md:flex-grow ms-10 me-6">
                    <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
                      DANIŞAN KİLO GRAFİĞİ
                    </h2>
                    <p className="leading-relaxed">
                    Kilo-boy oranı, bir bireyin kilosunun, boyuna göre uygun bir denge içinde olup olmadığını değerlendiren önemli bir sağlık ölçütüdür. Bu oran genellikle "Vücut Kitle İndeksi" (VKİ) olarak adlandırılır ve kilogram cinsinden ağırlığı, metre cinsinden boyun karesine bölerek hesaplanır.
                    </p>
                    <a href="/" className="rc-link">
                      Daha fazla bilgi için tıklayınız...
                      {ok}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 lg:w-1/2">
              <div className="ad-div-three ">
                <div className="ad-div-two">
                  <div className="ad-graph">
                    <Gender></Gender>
                  </div>
                  <div className="md:flex-grow ms-10 me-6">
                    <h2 className="ad-h-two">
                      KIZ - ERKEK ORANI
                    </h2>
                    <p className="leading-relaxed">
                      Toplumda cinsiyet dağılımına bağlı olarak kilo oranları farklılık gösterebilir. Genelde erkeklerin vücut kompozisyonu kadınlardan farklı olabilir ve bu durum kilo dağılımlarını etkileyebilir. Örneğin, erkeklerde daha fazla kas kütlesi bulunabilirken, kadınlarda vücut yağ oranı genellikle daha yüksektir.
                    </p>
                    <a href="/" className="rc-link">
                      Daha fazla bilgi için tıklayınız...
                      {ok}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ad-sec">
        <div className="ad-cont">
          <div className="ad-flex">
            <div className="ad-div">
              <div className="ad-card">
                {userSvg}
                <h2 className="ad-h">{userlist.length}</h2>
                <p className="leading-relaxed">Toplam Danışan Sayısı</p>
              </div>
            </div>
            <div className="ad-div">
              <div className="ad-card">
                {recipeSvg}

                <h2 className="ad-h">{recipes.length}</h2>
                <p className="leading-relaxed">Toplam Tarif Sayısı</p>
              </div>
            </div>
            <div className="ad-div">
              <div className="ad-card">
                {weightSvg}
                <h2 className="ad-h">{averageWeight} kg</h2>
                <p className="leading-relaxed">Danışan Kilo Ortalaması</p>
              </div>
            </div>
            <div className="ad-div">
              <div className="ad-card">
                {sizeSvg}
                <h2 className="ad-h">{averageSize} cm</h2>
                <p className="leading-relaxed">Danışan Boy Ortalaması</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminHome;
