import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';

const columnSearchProps = (dataIndex, placeholder, searchState) => {
    const useSearchState = searchState && searchState.length === 2
    const [tableSearch, setTableSearch] = searchState ? searchState : []

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        if (useSearchState) {
            setTableSearch({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
            })
        }
    };

    const handleReset = clearFilters => {
        clearFilters();
        if (useSearchState) {
            setTableSearch({ searchText: '' })
        }
    };

    let searchInput;
    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        searchInput = node;
                    }}
                    placeholder={`${placeholder ? `${placeholder}` : 'Search'}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        {'Search'}
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        {'Clear'}
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilterDropdownVisibleChange: visible => {
            if (visible) setTimeout(() => searchInput.select(), 100);
        },
        render: text => (
            text
        )
        // useSearchState && tableSearch.searchedColumn === dataIndex ? (
        //     <Highlighter
        //         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        //         searchWords={[tableSearch.searchText]}
        //         autoEscape
        //         textToHighlight={text ? text.toString() : ''}
        //     />
        // ) : (
        //     text
        // ),
    }
};

export default columnSearchProps;
