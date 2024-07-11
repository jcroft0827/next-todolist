import { RingLoader } from "react-spinners";

export default function Spinner() {
  return (
    <div>
        <RingLoader 
            // color
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
    </div>
  )
}
