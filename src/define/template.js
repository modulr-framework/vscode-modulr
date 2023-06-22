module.exports = (info) => {

return `${info.modulrInstance}.define('${info.moduleName}', [
    'require'
], function(require){

});
`;

}