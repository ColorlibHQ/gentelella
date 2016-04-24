All callbacks will only be called if `animate` is not `false`.

<table>
    <tr>
        <th>Callback(params, ...)</th>
        <th>Description</th>
    </tr>
    <tr>
        <td><strong>onStart(from, to)</strong></td>
        <td>Is called at the start of any animation.</td>
    </tr>
    <tr>
        <td><strong>onStep(from, to, currentValue)</strong></td>
        <td>Is called during animations providing the current value (the method is scoped to the context of th eplugin, so you can access the DOM element via <code>this.el</code>).</td>
    </tr>
    <tr>
        <td><strong>onStop(from, to)</strong></td>
        <td>Is called at the end of any animation.</td>
    </tr>
</table>
