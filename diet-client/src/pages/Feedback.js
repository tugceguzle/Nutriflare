import React from "react";

function Feedback() {
  return (
    <div className="rd-cont">
      <div className="rd-flex">
        <form className="w-full md:w-2/3 lg:w-1/2">
          <fieldset className="border p-4 rounded-lg">
            <legend className="text-2xl font-bold mb-4">Geri Bildirim</legend>
            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-700">
                Konu:
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="fb-input"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                E-Posta:
              </label>
              <input type="text" id="email" name="email" className="fb-input" />
            </div>

            <div className="mb-4">
              <label htmlFor="body" className="block text-gray-700">
                Açıklama:
              </label>
              <textarea
                id="body"
                name="body"
                className="fb-input"
                rows="4"
              ></textarea>
            </div>

            <input type="submit" value="Mail Gönder" className="fb-btn" />
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default Feedback;
