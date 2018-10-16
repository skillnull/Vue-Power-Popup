export default {
    name: 'RenderComponents',
    functional: true,
    props: {
        render: Function,
        dataDelive: Object
    },
    render: (h, ctx) => {
        return ctx.props.render(h, ctx)
    }
}
