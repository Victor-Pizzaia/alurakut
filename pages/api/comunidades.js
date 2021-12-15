import { SiteClient } from 'datocms-client';

export default async function requestFactory(req, resp) {
    if (req.method === "POST") {
        const TOKEN= process.env.DATO_POST_TOKEN;
        const client = new SiteClient(TOKEN);

        const record = await client.items.create({
            itemType: '1557076', // ID do model "communities gerado pelo dato"
            ...req.body,
        })

        resp.json({
            dados: 'Algum dado qualquer',
            record
        })
        return;
    }

    resp.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem"'
    })
}
