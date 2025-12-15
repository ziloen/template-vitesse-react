import type { Location } from 'react-router'
import { useLocation } from 'react-router'
import CarbonPedestrian from '~icons/carbon/pedestrian'

export default function Hi() {
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation() as Location<{ from?: string } | undefined>

  return (
    <div>
      <CarbonPedestrian className="inline-block text-4xl" />
      <p>Hi, {params.name}</p>
      <p className="text-sm opacity-50">
        <em>Dynamic route!</em>
      </p>

      <div>
        <button
          className="m-3 mt-8 btn text-sm"
          onClick={() => {
            if (location.state?.from) {
              navigate(-1)
            } else {
              navigate('/')
            }
          }}
        >
          Back
        </button>
      </div>
    </div>
  )
}
