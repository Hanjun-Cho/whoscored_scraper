import './Pitch.css';

function PitchBackgroud() {
  return (
  <>
    <div className='pitch-outer-lines'>
      <div className='pitch-background pitch-top-side'>
        <div className='pitch-top-18yd pitch-18yd-box'>
          <div className='pitch-top-6yd pitch-6yd-box'/>
          <div className='pitch-penalty-spot pitch-top-spot'/>
        </div>
      </div>
      <div className='pitch-background pitch-bottom-side'>
        <div className='pitch-bottom-18yd pitch-18yd-box'>
          <div className='pitch-bottom-6yd pitch-6yd-box'/>
          <div className='pitch-penalty-spot pitch-bottom-spot'/>
        </div>
      </div>
    </div>
    <div className='pitch-center-circle'></div>
  </>
  )
}

export default PitchBackgroud;
