import { use } from 'react'

type Params = Promise<{ slug: string }>

export default function Page(props: {
    params: Params
}) {
    const params = use(props.params)
    const slug = params.slug

    return (
        <div>
            <h1>Page {slug}</h1>
        </div>
    )
}