export default function IntroductionCard({number, content}) {

  return (
    <div className="introductionCard">
      <div className="numberArea">
        <label className="numberAboutUs">{(number > 999) ? "999+" : number}</label>
      </div>
      <div className="contentArea">
        <label className="contentAboutUs">{content}</label>
      </div>
    </div>
  )
}