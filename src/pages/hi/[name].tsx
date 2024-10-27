import { useLocation } from 'react-router-dom'
import CarbonPedestrian from '~icons/carbon/pedestrian'

export default function Hi() {
  const navigate = useNavigate()
  const params = useParams()
  const location = useLocation()

  return (
    <div>
      <CarbonPedestrian className="inline-block text-4xl" />
      <p>Hi, {params.name}</p>
      <p className="text-sm opacity-50">
        <em>Dynamic route!</em>
      </p>

      <div>
        <button
          className="btn m-3 mt-8 text-sm"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (location.state?.back) {
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
